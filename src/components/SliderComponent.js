import React, {useEffect, useRef, useState} from 'react';
import './sliderComponent.css'
import Slider from 'react-slider'
import dayjs from "dayjs";
import tooltip from '../img/tooltip.svg'
import tooltipTop from '../img/tooltipTop.svg'

require('dayjs/locale/ru')
const customParseFormat = require('dayjs/plugin/customParseFormat')

const SliderComponent = (props) => {
        dayjs.locale('ru')
        dayjs.extend(customParseFormat)
        dayjs('Март 2023', 'MMMM YYYY', 'ru') // Формат для отрисовки дат

        let filtrationParams = ({ // Объект с месяцами для отрисовки
            months: [
                {key: '1', name: 'фев'},
                {key: '2', name: 'мар'},
                {key: '3', name: 'апр'},
                {key: '4', name: 'май'},
                {key: '5', name: 'июн'},
                {key: '6', name: 'июл'},
                {key: '7', name: 'авг'},
                {key: '8', name: 'сен'},
                {key: '9', name: 'окт'},
                {key: '10', name: 'ноя'},
                {key: '11', name: 'дек'},
            ]
        })

        function ucFirst(str) {
            if (!str) return str;
            // Функция для форматирования даты (написание с заглавной буквы)
            return str[0].toUpperCase() + str.slice(1);
        }

        let startDate = props.dates.length > 0 ? Number(dayjs(props.dates[0]).format('YYYY')) : null // Год максимальной максимальной даты
        let endDate = props.dates.length > 0 ? Number(dayjs(props.dates[1]).format('YYYY')) : null // Год минимальной максимальной даты
        let startMonthSelected = props.selectedDates.length > 0 ? Number(dayjs(props.selectedDates[0]).format('MM')) : null // Месяц начала выбранной даты
        let startYearSelected = props.selectedDates.length > 0 ? Number(dayjs(props.selectedDates[0]).format('YYYY')) : null // Год начала выбранной даты
        let endMonthSelected = props.selectedDates.length > 0 ? Number(dayjs(props.selectedDates[1]).format('MM')) : null // Месяц конца выбранной даты
        let endYearSelected = props.selectedDates.length > 0 ? Number(dayjs(props.selectedDates[1]).format('YYYY')) : null // Год конца выбранной даты

        const [tooltipLeft, setTooltipLeft] = useState('') // Значение левого тултипа
        const [tooltipRight, setTooltipRight] = useState('') // Значение правого тултипа
        const [leftDate, setLeftDate] = useState() // Дата для вычисления значения левого тултипа
        const [rightDate, setRightDate] = useState() // Дата для вычисления значения левого тултипа


        let years = []
        let i = startDate
        while (i <= endDate + 1) {
            years.push(i)
            i += 1
        }
        let maxMonths = (endDate + 1 - startDate) * 12
        // Рассчет параметров если режим "все года"

        let months = []
        let k = 0
        let y = 0
        let r = 0
        while (r <= 36) {
            r++
            if (k === 0) {
                months.push(startDate + y)
                y += 1
                k += 11
            } else {
                months.push(filtrationParams.months[11 - k].name)
                k -= 1
            }
        }
        // Рассчет параметров если режим "месяца"


        const [start, setStart] = useState(0)
        const [end, setEnd] = useState(maxMonths)

        // Минимальное и максимальное значения слайдера

        useEffect(() => {
            setEnd(maxMonths)
        }, [maxMonths])
        // Установка максимального значения слайдера, которое равно максимальному количеству месяцев


        useEffect(() => {
            let start = (startYearSelected - startDate) * 12 + startMonthSelected - 1
            let end = (endYearSelected - startDate) * 12 + endMonthSelected - 1
            setStart(start)
            setEnd(props.switcher ? end : 36)
            setLeftDate(props.selectedDates[0])
            setRightDate(props.selectedDates[1])


        }, [props.selectedDates, endMonthSelected, endYearSelected, props.switcher, startDate, startMonthSelected, startYearSelected])

        //Расчет положения тумблеров в зависимости от выбранного промежутка


        const prevStart = usePrevious(start)
        const prevEnd = usePrevious(end)

        // Вспомогательные перменные для того, чтобы понимать в какую сторону в данный момент двигается тумблер


        useEffect(() => {
            setTooltipLeft(ucFirst(dayjs(leftDate).format("MMMM YYYY")))
        }, [leftDate])

        useEffect(() => {
            setTooltipRight(ucFirst(dayjs(rightDate).format("MMMM YYYY")))
        }, [rightDate])

        // Установка значений в тултипы при движении тумблеров

        useEffect(() => {

        }, [props])

        return (
            <div className={"slider__inner"}>
                <div>
                    <Slider
                        disabled={props.selectedDates.length === 0}
                        value={[start, end]}
                        className="slider"
                        trackClassName="tracker"
                        min={0}
                        max={maxMonths}
                        minDistance={1}
                        step={1}
                        withTracks={true}
                        pearling={true}
                        renderThumb={(props) => {
                            return <div {...props}>
                                {props.key === "thumb-0" &&
                                    <div className={"slider__tooltip-left"}><img alt={""} src={tooltipTop}></img>
                                        <div className={'slider__tooltip-text'}>{tooltipLeft}</div>
                                    </div>}
                                {props.key === "thumb-1" &&
                                    <div className="slider__tooltip-right"><img alt={""} src={tooltip}></img>
                                        <div className={'slider__tooltip-text'}>{tooltipRight}</div>
                                    </div>}

                            </div>
                        }}
                        renderTrack={(props) => {
                            return <div {...props} className="slider__track"></div>;
                        }}
                        // При движении тумблеров проверяется предыдущее состояние. Если оно больше, чем новое, то значит тумблер...
                        //... двигается в левую сторону и наоборот. На основе этой разницы рассчитывается количество месяцев, которое нужно...
                        // добавить или убавить
                        onChange={([start, end]) => {
                            setStart(start);
                            if (props.selectedDates.length !== 0) {
                                if (start > prevStart) {
                                    let newValue = start - prevStart
                                    setLeftDate(dayjs(leftDate).add(newValue, "M"))
                                } else {

                                    let newValue = prevStart - start
                                    setLeftDate(dayjs(leftDate).subtract(newValue, "M"))

                                }
                            }
                            if (props.selectedDates.length !== 0) {
                                if (end > prevEnd) {
                                    let newValue = end - prevEnd
                                    setRightDate(dayjs(rightDate).add(newValue, "M"))
                                } else {

                                    let newValue = prevEnd - end
                                    setRightDate(dayjs(rightDate).subtract(newValue, "M"))

                                }
                            }
                            setEnd(end);
                        }}
                    />
                </div>
                {props.switcher ? <div className={'slider__years'}>
                    {props.dates.length > 0 ? years.map(y => {
                        return <div>{y}</div>
                    }) : null}
                </div> : <div className={'slider__months'}>
                    {props.dates.length > 0 ? months.map(m => {
                        if (typeof (m) === "number") {
                            return <div className={"slider__year-number"}>{m}</div>
                        } else {
                            return <div className={"slider__month-number"}>{m}</div>
                        }

                    }) : null}
                </div>}
            </div>
        );
    }
;

// Хук для получения предыдущего состояния переменных
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export default SliderComponent;